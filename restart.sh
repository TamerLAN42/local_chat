#!/bin/bash
set -e

# URL API
API_URL="http://localhost:41957/messages"

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"System","text":"⚠️ ВНИМАНИЕ! Последовательность перезапуска инициирована"}' > /dev/null
sleep 5
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"System","text":"⚠️ Рестарт через 10 секунд"}' > /dev/null

sleep 5

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"System","text":"⚠️ Рестарт через 5 секунд"}' > /dev/null

sleep 5

curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"System","text":"⚠️ Рестарт... Ох, чёрт, уже пора?"}' > /dev/null

sleep 2

echo "[]" > ./server/messages.txt

docker restart chat
