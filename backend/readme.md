Scalability Concerns for v2?

CPU & I/O Load

Video encoding (ffmpeg, MoviePy) is CPU-intensive. Fifty simultaneous encodes can quickly saturate a single CPU.

Disk I/O (reading/writing audio, video, subtitles) will spike. On a single server with spinning storage, this can lead to contention.

Event Loop Blocking

If you leave your endpoint as async def but perform blocking work, the server’s event loop stalls, affecting all other requests.

Solution: offload to worker threads/processes (e.g. FastAPI threadpool, Celery tasks, or a separate microservice).

Memory Consumption

Each video + audio clip loaded in memory (MoviePy) adds tens to hundreds of MB. Fifty requests could exhaust RAM.

Better to stream through ffmpeg subprocesses rather than load entire clips into Python.

Disk Space & Cleanup

Temp files accumulate if not cleaned up promptly. In high-throughput scenarios, you could run out of disk.

Use ephemeral storage (e.g. container /tmp or memfs) and ensure background cleanup always runs, even on failures.

Process Isolation

Running ffmpeg in the same process pool risks one job crashing or consuming all threads.

Consider offloading video processing to a dedicated worker pool or container cluster (e.g. Kubernetes Jobs, AWS Fargate).

Autoscaling & Load Balancing

For consistent 50-user load, deploy behind a load balancer with multiple replicas.

Use horizontal autoscaling: spin up more workers when CPU or queue length exceeds thresholds.

Asynchronous Job Queue

Instead of handling everything in-request, push “summarize → TTS → video render” as a background job.

Return a job ID immediately; let clients poll or receive a webhook when the final video is ready and stored (e.g. in S3).

Rate-Limiting External APIs

OpenAI and ElevenLabs impose rate limits. Fifty concurrent calls may hit those limits.

Implement exponential back-off, request batching, or a local cache of identical requests.
