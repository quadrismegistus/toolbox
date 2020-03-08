# import os
# import sys
#
#
# sys.path.insert(0, os.path.dirname(__file__))
#
#
# def application(environ, start_response):
#     start_response('200 OK', [('Content-Type', 'text/plain')])
#     message = 'It works!\n'
#     version = 'Python %s\n' % sys.version.split()[0]
#     response = '\n'.join([message, version])
#     return [response.encode()]

# import os
# import sys
# import importlib.util
#
# sys.path.insert(0, os.path.dirname(os.path.realpath('__file__')))
#
# spec = importlib.util.spec_from_file_location("wsgi", "__init__.py")
# wsgi = importlib.util.module_from_spec(spec)
# spec.loader.exec_module(wsgi)
# application = wsgi.app
