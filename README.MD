temporary repository for testing logic to run in seperate thread with fallback:

1. try to run in shared thread (to support multiple clients)
2. try to run in in closed thread (at least run it in a thread)
3. run the logic in the main thread (no multithreading detected)