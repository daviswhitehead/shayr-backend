# Most recent firestore export
gsutil ls gs://shayr-a2346-firestore-exports/ | sort -r | head -1

# Big Query Import
## users
bq --location=US load \
--replace \
--source_format=DATASTORE_BACKUP \
firestore.users \
gs://shayr-a2346-firestore-exports/<PATH>/all_namespaces/kind_users/all_namespaces_kind_users.export_metadata

## posts
bq --location=US load \
--replace \
--source_format=DATASTORE_BACKUP \
firestore.posts \
gs://shayr-a2346-firestore-exports/<PATH>/all_namespaces/kind_posts/all_namespaces_kind_posts.export_metadata

## shares
bq --location=US load \
--replace \
--source_format=DATASTORE_BACKUP \
firestore.shares \
gs://shayr-a2346-firestore-exports/<PATH>/all_namespaces/kind_shares/all_namespaces_kind_shares.export_metadata