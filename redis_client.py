import redis
import os
import json

# Redis connection URL, default to localhost for local testing
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Cache key for the students list
STUDENTS_CACHE_KEY = "students_list"

# Graceful connection setup
try:
    # Use decode_responses=True so we get string values directly instead of bytes
    redis_client = redis.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=2)
except Exception as e:
    print(f"[-] Redis connection setup error: {e}")
    redis_client = None

def get_cached_students():
    """Retrieve students list from Redis cache."""
    if not redis_client:
        return None
    try:
        data = redis_client.get(STUDENTS_CACHE_KEY)
        if data:
            print("[+] Redis cache hit!")
            return json.loads(data)
    except Exception as e:
        print(f"[-] Redis get cache error: {e}")
    return None

def set_cached_students(students):
    """Serialize and save students list to Redis cache with a 1-hour expiration."""
    if not redis_client:
        return
    try:
        serialized_students = []
        for s in students:
            serialized_students.append({
                "id": s.id,
                "name": s.name,
                "roll_no": s.roll_no,
                "phone_number": s.phone_number
            })
        redis_client.setex(STUDENTS_CACHE_KEY, 3600, json.dumps(serialized_students))
        print("[+] Redis cache populated.")
    except Exception as e:
        print(f"[-] Redis set cache error: {e}")

def invalidate_student_cache():
    """Delete the students list cache key to force a fresh DB query next time."""
    if not redis_client:
        return
    try:
        redis_client.delete(STUDENTS_CACHE_KEY)
        print("[+] Redis cache invalidated.")
    except Exception as e:
        print(f"[-] Redis cache invalidation error: {e}")
