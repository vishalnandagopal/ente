import 'dart:convert';

// Visibility Constants
const visibilityVisible = 0;
const visibilityArchive = 1;
const visibilityHidden = 2;

// Collection SubType Constants
const subTypeDefaultHidden = 1;
const subTypeSharedFilesCollection = 2;

const magicKeyVisibility = 'visibility';
// key for collection subType
const subTypeKey = 'subType';

const pubMagicKeyEditedTime = 'editedTime';
const pubMagicKeyEditedName = 'editedName';
const pubMagicKeyCaption = "caption";
const pubMagicKeyUploaderName = "uploaderName";
const publicMagicKeyWidth = 'w';
const publicMagicKeyHeight = 'h';

class MagicMetadata {
  // 0 -> visible
  // 1 -> archived
  // 2 -> hidden etc?
  int visibility;

  MagicMetadata({required this.visibility});

  factory MagicMetadata.fromEncodedJson(String encodedJson) =>
      MagicMetadata.fromJson(jsonDecode(encodedJson));

  factory MagicMetadata.fromJson(dynamic json) => MagicMetadata.fromMap(json);

  static fromMap(Map<String, dynamic>? map) {
    if (map == null) return null;
    return MagicMetadata(
      visibility: map[magicKeyVisibility] ?? visibilityVisible,
    );
  }
}

class PubMagicMetadata {
  int? editedTime;
  String? editedName;
  String? caption;
  String? uploaderName;
  int? w;
  int? h;

  PubMagicMetadata({
    this.editedTime,
    this.editedName,
    this.caption,
    this.uploaderName,
    this.w,
    this.h,
  });

  factory PubMagicMetadata.fromEncodedJson(String encodedJson) =>
      PubMagicMetadata.fromJson(jsonDecode(encodedJson));

  factory PubMagicMetadata.fromJson(dynamic json) =>
      PubMagicMetadata.fromMap(json);

  static fromMap(Map<String, dynamic>? map) {
    if (map == null) return null;
    return PubMagicMetadata(
      editedTime: map[pubMagicKeyEditedTime],
      editedName: map[pubMagicKeyEditedName],
      caption: map[pubMagicKeyCaption],
      uploaderName: map[pubMagicKeyUploaderName],
      w: map[publicMagicKeyWidth],
      h: map[publicMagicKeyHeight],
    );
  }
}

class CollectionMagicMetadata {
  // 0 -> visible
  // 1 -> archived
  // 2 -> hidden etc?
  int visibility;

  // null/0 value -> no subType
  // 1 -> DEFAULT_HIDDEN COLLECTION for files hidden individually
  // 2 -> Collections created for sharing selected files
  int? subType;

  CollectionMagicMetadata({required this.visibility, this.subType});

  Map<String, dynamic> toJson() {
    final result = {magicKeyVisibility: visibility};
    if (subType != null) {
      result[subTypeKey] = subType!;
    }
    return result;
  }

  factory CollectionMagicMetadata.fromEncodedJson(String encodedJson) =>
      CollectionMagicMetadata.fromJson(jsonDecode(encodedJson));

  factory CollectionMagicMetadata.fromJson(dynamic json) =>
      CollectionMagicMetadata.fromMap(json);

  static fromMap(Map<String, dynamic>? map) {
    if (map == null) return null;
    return CollectionMagicMetadata(
      visibility: map[magicKeyVisibility] ?? visibilityVisible,
      subType: map[subTypeKey],
    );
  }
}
