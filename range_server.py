#!/usr/bin/env python3
"""Tiny HTTP server with byte-range support + .htaccess-style URL rewrites."""
import http.server
import os
import re
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080

# Mirror of .htaccess RewriteRules — keep in sync
REWRITES = {
    '/ergebnis':      '/result.html',
    '/ergebnis-2':    '/result2.html',
    '/ergebnis-3':    '/result3.html',
    '/challenge':     '/offer.html',
    '/plan-email':    '/plan-email.html',
    '/plan-loading':  '/plan-loading.html',
    '/loading-quiz':  '/loading-quiz.html',
    '/danke':         '/danke.html',
    '/analyse-report': '/report.html',
}

def rewrite(path):
    """Strip query, look up rewrite, re-attach query. Trailing slash tolerated."""
    base, _, query = path.partition('?')
    base = base.rstrip('/') or '/'
    if base in REWRITES:
        base = REWRITES[base]
    return base + ('?' + query if query else '')

class RangeHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        self.path = rewrite(self.path)
        path = self.translate_path(self.path.split('?', 1)[0])
        if not os.path.isfile(path):
            return super().do_GET()
        rng = self.headers.get('Range')
        size = os.path.getsize(path)
        if not rng:
            return super().do_GET()
        m = re.match(r'bytes=(\d*)-(\d*)', rng)
        if not m:
            return super().do_GET()
        start_s, end_s = m.group(1), m.group(2)
        start = int(start_s) if start_s else 0
        end = int(end_s) if end_s else size - 1
        start = max(0, start); end = min(end, size - 1)
        if start > end:
            self.send_response(416)
            self.send_header('Content-Range', f'bytes */{size}')
            self.end_headers()
            return
        length = end - start + 1
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404)
            return
        try:
            self.send_response(206)
            self.send_header('Content-Type', ctype)
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
            self.send_header('Content-Length', str(length))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            f.seek(start)
            remaining = length
            chunk = 64 * 1024
            while remaining > 0:
                buf = f.read(min(chunk, remaining))
                if not buf:
                    break
                try:
                    self.wfile.write(buf)
                except (BrokenPipeError, ConnectionResetError):
                    break
                remaining -= len(buf)
        finally:
            f.close()

    def do_HEAD(self):
        self.path = rewrite(self.path)
        super().do_HEAD()

    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

class ThreadedTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with ThreadedTCPServer(('0.0.0.0', PORT), RangeHandler) as httpd:
        print(f'Range-HTTP serving on http://localhost:{PORT}')
        httpd.serve_forever()
