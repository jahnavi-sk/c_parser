import mysql.connector
import os
from pycparser import c_parser, c_ast, parse_file
from typing import Dict

class CCodeAnalyzer(c_ast.NodeVisitor):
    def __init__(self, db_connection, submission_id: int):
        self.conn = db_connection
        self.cursor = self.conn.cursor()
        self.submission_id = submission_id
        self.current_file = "main.c"
        
        # Store mappings for later use
        self.datatype_ids = {}
        self.function_ids = {}

    def _insert_datatype(self, name: str, size: int, is_built_in: bool = True, is_macro: bool = False) -> int:
        """Insert a datatype into the database and return its ID."""
        query = """
        INSERT INTO datatypes (name, size, isBuiltIn, isMacro, submissionID)
        VALUES (%s, %s, %s, %s, %s)
        """
        try:
            self.cursor.execute(query, (name, size, is_built_in, is_macro, self.submission_id))
            self.conn.commit()
            return self.cursor.lastrowid
        except mysql.connector.Error as err:
            print(f"Error inserting datatype: {err}")
            return -1

    def _get_type_info(self, type_node) -> tuple:
        """Get datatype name and size."""
        if isinstance(type_node, c_ast.TypeDecl):
            return self._get_type_info(type_node.type)
        elif isinstance(type_node, c_ast.IdentifierType):
            size_map = {
                'char': 1,
                'short': 2,
                'int': 4,
                'long': 8,
                'float': 4,
                'double': 8,
                'void': 0
            }
            type_name = ' '.join(type_node.names)
            return type_name, size_map.get(type_node.names[-1], 4)
        return 'unknown', 4

    def visit_Decl(self, node):
        """Visit declaration nodes for variables and functions."""
        if isinstance(node.type, c_ast.FuncDecl):
            self._process_function(node)
        elif isinstance(node.type, c_ast.TypeDecl):
            self._process_variable(node)

    def visit_UnaryOp(self, node):
        """Skip sizeof expressions."""
        if node.op == 'sizeof':
            return  # Ignore sizeof operations
        self.generic_visit(node)

    def visit_FuncCall(self, node):
        """Skip printf, scanf, and other I/O operations."""
        if isinstance(node.name, c_ast.ID) and node.name.name in {'printf', 'scanf', 'gets', 'puts'}:
            return  # Ignore these function calls
        self.generic_visit(node)  # Process other function calls normally

    def _process_function(self, node):
        """Insert function declaration into the database."""
        func_name = node.name
        return_type, _ = self._get_type_info(node.type.type)
        if return_type not in self.datatype_ids:
            type_id = self._insert_datatype(return_type, 4)
            self.datatype_ids[return_type] = type_id

        query = """
        INSERT INTO func (name, initialLine, numberOfParameters, returnTypeID, fileRef, submissionID)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params_count = len(node.type.args.params) if node.type.args else 0
        try:
            self.cursor.execute(query, (
                func_name,
                node.coord.line if hasattr(node.coord, 'line') else 0,
                params_count,
                self.datatype_ids[return_type],
                self.current_file,
                self.submission_id
            ))
            self.conn.commit()
            self.function_ids[func_name] = self.cursor.lastrowid
        except mysql.connector.Error as err:
            print(f"Error inserting function: {err}")

    def _process_variable(self, node):
        """Insert variable declaration into the database."""
        var_name = node.name
        type_name, size = self._get_type_info(node.type.type)
        if type_name not in self.datatype_ids:
            type_id = self._insert_datatype(type_name, size)
            self.datatype_ids[type_name] = type_id

        initial_value = node.init.value if isinstance(node.init, c_ast.Constant) else None
        scope = 'global' if not hasattr(node, 'storage') else 'local'

        query = """
        INSERT INTO variables (name, initialValue, scope, dataTypeID, fileRef, submissionID)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        try:
            self.cursor.execute(query, (
                var_name,
                initial_value,
                scope,
                self.datatype_ids[type_name],
                self.current_file,
                self.submission_id
            ))
            self.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error inserting variable: {err}")

    def visit_If(self, node):
        """Handle 'if' control structures."""
        self._insert_control_structure('if', node)
        self.generic_visit(node)

    def visit_While(self, node):
        """Handle 'while' control structures."""
        self._insert_control_structure('while', node)
        self.generic_visit(node)

    def visit_For(self, node):
        """Handle 'for' control structures."""
        self._insert_control_structure('for', node)
        self.generic_visit(node)

    def _insert_control_structure(self, structure_type: str, node) -> None:
        """Insert control structures into the database."""
        query = """
        INSERT INTO controlStructure (structureType, cond, lineNumber, fileRef, submissionID)
        VALUES (%s, %s, %s, %s, %s)
        """
        condition = str(node.cond) if hasattr(node, 'cond') else None
        try:
            self.cursor.execute(query, (
                structure_type,
                condition,
                node.coord.line if hasattr(node.coord, 'line') else 0,
                self.current_file,
                self.submission_id
            ))
            self.conn.commit()
        except mysql.connector.Error as err:
            print(f"Error inserting control structure: {err}")
