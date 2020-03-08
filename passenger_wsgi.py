import os
import sys
import importlib.util

sys.path.insert(0, os.path.dirname(os.path.realpath('__file__')))

spec = importlib.util.spec_from_file_location("wsgi", "__init__.py")
wsgi = importlib.util.module_from_spec(spec)
spec.loader.exec_module(wsgi)
application = wsgi.app
