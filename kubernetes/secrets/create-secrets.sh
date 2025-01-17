#!/bin/bash

# Read .env file
source .env

# Create a temporary yaml file for secrets
cat << EOF > temp-secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  MONGODB_URI: $(echo -n $MONGODB_URI | base64)
  JWT_SECRET: $(echo -n $JWT_SECRET | base64)
  FACEBOOK_APP_ID: $(echo -n $FACEBOOK_APP_ID | base64)
  FACEBOOK_APP_SECRET: $(echo -n $FACEBOOK_APP_SECRET | base64)
  GOOGLE_CLIENT_ID: $(echo -n $GOOGLE_CLIENT_ID | base64)
  GOOGLE_CLIENT_SECRET: $(echo -n $GOOGLE_CLIENT_SECRET | base64)
EOF

# Apply the secrets to Kubernetes
kubectl apply -f temp-secrets.yaml

# Remove the temporary file
rm temp-secrets.yaml

echo "✅ Secrets created successfully" 