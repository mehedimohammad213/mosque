class Mosque {
  final int id;
  final String name;
  final String? nameBn;
  final String? address;
  final String division;
  final String district;
  final String? upazila;
  final String? area;
  final String status;
  final double? latitude;
  final double? longitude;
  final String? mosqueImage;

  const Mosque({
    required this.id,
    required this.name,
    this.nameBn,
    this.address,
    required this.division,
    required this.district,
    this.upazila,
    this.area,
    required this.status,
    this.latitude,
    this.longitude,
    this.mosqueImage,
  });

  String get location {
    final parts = [
      area,
      upazila,
      district,
      division,
    ].where((p) => p != null && p.trim().isNotEmpty).cast<String>();
    if (parts.isNotEmpty) return parts.join(', ');
    if (address != null && address!.trim().isNotEmpty) return address!;
    return 'No location';
  }

  /// Map point — uses stored coords, or a stable fallback by district/id.
  ({double lat, double lng}) get mapPoint {
    if (latitude != null && longitude != null) {
      return (lat: latitude!, lng: longitude!);
    }
    final base = _districtCenter(district);
    final offset = (id % 7) * 0.008;
    return (lat: base.lat + offset, lng: base.lng + (id % 5) * 0.006);
  }

  static ({double lat, double lng}) _districtCenter(String district) {
    switch (district.toLowerCase()) {
      case 'chittagong':
      case 'chattogram':
        return (lat: 22.3569, lng: 91.7832);
      case 'sylhet':
        return (lat: 24.8949, lng: 91.8687);
      case 'rajshahi':
        return (lat: 24.3745, lng: 88.6042);
      case 'khulna':
        return (lat: 22.8456, lng: 89.5403);
      default:
        return (lat: 23.8103, lng: 90.4125); // Dhaka
    }
  }

  bool matchesQuery(String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return true;
    return name.toLowerCase().contains(q) ||
        (nameBn?.toLowerCase().contains(q) ?? false) ||
        location.toLowerCase().contains(q) ||
        (address?.toLowerCase().contains(q) ?? false);
  }

  factory Mosque.fromJson(Map<String, dynamic> json) {
    double? parseCoord(dynamic v) {
      if (v == null) return null;
      return double.tryParse(v.toString());
    }

    return Mosque(
      id: json['id'] as int,
      name: json['name'] as String,
      nameBn: json['name_bn'] as String?,
      address: json['address'] as String?,
      division: json['division'] as String? ?? '',
      district: json['district'] as String? ?? '',
      upazila: json['upazila'] as String?,
      area: json['area'] as String?,
      status: json['status'] as String? ?? '',
      latitude: parseCoord(json['latitude']),
      longitude: parseCoord(json['longitude']),
      mosqueImage: json['mosque_image'] as String?,
    );
  }
}
