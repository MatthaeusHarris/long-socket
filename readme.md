- Initial connection:
```json
{
    "send": {
        "this": {
            "is": [
                "the", 
                "initial", 
                "json", 
                "blob"
            ]
        }
    }, 
    "address": "hostname:port"
}
```

- Proxy response:
```json
{
    "res": {
        "this": {
            "is": [
                "the", 
                "server", 
                "response"
            ]
        }
    }, 
    "seq": 1
}
```

- Subsequent connections (seq is the sequence number of the last received blob from the proxy):
```json
{
    "seq": 1, 
    "send": {
        "this": {
            "is": [
                "more", 
                "json"
            ]
        }
    }
}
```

Please note that in the above example the "send" key/value pair is optional, and should be emitted if the client has just received data and is checking to see if there is more, but has nothing to send.

The proxy will only send one JSON blob per HTTP request, and will close the request afterwards.  Sequence numbers are strictly sequential.  For now, blobs received out of sequence should be ignored.  They will be re-sent.