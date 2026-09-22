import 'package:flutter_dotenv/flutter_dotenv.dart';

String get apiBaseUrl =>
    dotenv.env['API_BASE_URL']?.trim().isNotEmpty == true
        ? dotenv.env['API_BASE_URL']!.trim()
        : 'http://192.168.20.244:3000';
