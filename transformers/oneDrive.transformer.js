export default function oneDriveTransformer(fileItem) {
    return {
      id: fileItem.id,
      name: fileItem.name,
      mimeType: fileItem.file.mimeType,
      url: fileItem["@microsoft.graph.downloadUrl"],
      attachmentSource: 'onedrive'
    };
  }
  