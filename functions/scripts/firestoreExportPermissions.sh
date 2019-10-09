gcloud projects add-iam-policy-binding PROJECT_ID \
    --member serviceAccount:PROJECT_ID@appspot.gserviceaccount.com \
    --role roles/datastore.importExportAdmin

gsutil iam ch serviceAccount:PROJECT_ID@appspot.gserviceaccount.com:admin \
    gs://BUCKET_NAME

# For shayr-dev
gcloud projects add-iam-policy-binding shayr-dev \
    --member serviceAccount:shayr-dev@appspot.gserviceaccount.com \
    --role roles/datastore.importExportAdmin

gsutil iam ch serviceAccount:shayr-dev@appspot.gserviceaccount.com:admin \
    gs://shayr-dev-firestore-exports

# For shayr-a2346
gcloud projects add-iam-policy-binding shayr-a2346 \
    --member serviceAccount:shayr-a2346@appspot.gserviceaccount.com \
    --role roles/datastore.importExportAdmin

gsutil iam ch serviceAccount:shayr-a2346@appspot.gserviceaccount.com:admin \
    gs://shayr-a2346-firestore-exports