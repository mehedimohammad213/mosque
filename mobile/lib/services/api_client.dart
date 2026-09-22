import 'dart:convert';

import 'package:http/http.dart' as http;

import '../config.dart';
import '../models/fund_request.dart';
import '../models/mosque.dart';
import '../models/weekly_collection.dart';

class ApiException implements Exception {
  final String message;
  final int? status;

  ApiException(this.message, [this.status]);

  @override
  String toString() => message;
}

/// Public API client — no authentication required.
class ApiClient {
  ApiClient();

  Future<List<Mosque>> listMosques() async {
    final data = await _get('/api/mosques');
    return (data as List)
        .map((e) => Mosque.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<WeeklyCollection>> listWeeklyCollections(int mosqueId) async {
    final data = await _get('/api/weekly-collections?mosque_id=$mosqueId');
    return (data as List)
        .map((e) => WeeklyCollection.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<List<FundRequest>> listFundRequests() async {
    final data = await _get('/api/fund-requests');
    return (data as List)
        .map((e) => FundRequest.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<dynamic> _get(String path) async {
    final uri = Uri.parse('$apiBaseUrl$path');
    final res = await http.get(
      uri,
      headers: const {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    );

    if (res.statusCode < 200 || res.statusCode >= 300) {
      String message = 'Request failed (${res.statusCode})';
      try {
        final err = jsonDecode(res.body);
        if (err is Map && err['error'] != null) {
          message = err['error'].toString();
        }
      } catch (_) {}
      throw ApiException(message, res.statusCode);
    }

    if (res.body.isEmpty) return null;
    return jsonDecode(res.body);
  }
}

final api = ApiClient();
