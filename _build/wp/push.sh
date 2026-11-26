#!/bin/bash
# usage: ./push.sh <upload-token>   (token for wp-content/uploads/sofia-import/import.tar)
cd "$(dirname "$0")"
rm -f import.tar && tar -cf import.tar -C out classes.json footer.json header.json manifest.json media.json pages site.css site.js && \
curl -sk -X PUT -H "X-Novamira-Upload-Token: $1" --data-binary @import.tar "https://sofia-medical.com/wp-json/novamira/v1/upload" | head -c 160; echo
