import sys, shutil, time
from gradio_client import Client, handle_file
img, prompt, out, dur, wait = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5])
time.sleep(wait)
t = time.time()
c = Client('https://zerogpu-aoti-wan2-2-fp8da-aoti-faster.hf.space/', headers={'x-hf-authorization': 'Bearer proxy-injected'}, verbose=False)
r = c.predict(handle_file(img), prompt, 6, duration_seconds=dur, api_name='/generate_video')
v = r[0]['video'] if isinstance(r[0], dict) else r[0]
shutil.copy(v, out)
print('OK', out, round(time.time() - t), 's')
