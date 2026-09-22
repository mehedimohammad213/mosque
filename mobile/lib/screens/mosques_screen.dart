import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';

import '../models/mosque.dart';
import '../models/weekly_collection.dart';
import '../services/api_client.dart';
import '../theme/app_theme.dart';
import '../widgets/common.dart';
import '../widgets/mosque_marker.dart';
import '../widgets/mosque_collection_card.dart';

class MosquesScreen extends StatefulWidget {
  const MosquesScreen({super.key});

  @override
  State<MosquesScreen> createState() => _MosquesScreenState();
}

class _MosquesScreenState extends State<MosquesScreen> {
  final _searchCtrl = TextEditingController();
  final _mapCtrl = MapController();

  List<Mosque> _all = [];
  Map<int, WeeklyCollection?> _latestByMosque = {};
  Mosque? _selected;
  List<WeeklyCollection> _selectedCollections = [];
  bool _loadingCollections = false;
  bool _loading = true;
  bool _mapReady = false;
  String? _error;
  String _query = '';
  LatLng _center = const LatLng(23.8103, 90.4125);
  double _zoom = 12;

  static const _dhaka = LatLng(23.8103, 90.4125);

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    _mapCtrl.dispose();
    super.dispose();
  }

  List<Mosque> get _filtered =>
      _all.where((m) => m.matchesQuery(_query)).toList();

  void _moveMap(LatLng point, double zoom) {
    _center = point;
    _zoom = zoom;
    if (!_mapReady) return;
    _mapCtrl.move(point, zoom);
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
      _mapReady = false;
    });
    try {
      final mosques = await api.listMosques();
      final latest = <int, WeeklyCollection?>{};
      await Future.wait(mosques.map((m) async {
        try {
          final rows = await api.listWeeklyCollections(m.id);
          latest[m.id] = rows.isEmpty ? null : rows.first;
        } catch (_) {
          latest[m.id] = null;
        }
      }));
      if (!mounted) return;
      if (mosques.isNotEmpty) {
        final p = mosques.first.mapPoint;
        _center = LatLng(p.lat, p.lng);
        _zoom = 12;
      }
      setState(() {
        _all = mosques;
        _latestByMosque = latest;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = '$e';
      });
    }
  }

  Future<void> _selectMosque(Mosque mosque) async {
    setState(() {
      _selected = mosque;
      _loadingCollections = true;
      _selectedCollections = [];
      _searchCtrl.text = mosque.name;
      _query = mosque.name;
    });
    final p = mosque.mapPoint;
    _moveMap(LatLng(p.lat, p.lng), 15);

    try {
      final rows = await api.listWeeklyCollections(mosque.id);
      if (!mounted) return;
      setState(() {
        _selectedCollections = rows;
        _loadingCollections = false;
        if (rows.isNotEmpty) {
          _latestByMosque = {..._latestByMosque, mosque.id: rows.first};
        }
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loadingCollections = false);
    }
  }

  void _clearSelection() {
    setState(() {
      _selected = null;
      _selectedCollections = [];
      _searchCtrl.clear();
      _query = '';
    });
  }

  Future<void> _goToMyLocation() async {
    try {
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        _moveMap(_dhaka, 12);
        return;
      }
      final pos = await Geolocator.getCurrentPosition();
      _moveMap(LatLng(pos.latitude, pos.longitude), 14);
    } catch (_) {
      _moveMap(_dhaka, 12);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const ColoredBox(
        color: AppColors.mapBg,
        child: Center(child: CircularProgressIndicator()),
      );
    }
    if (_error != null) {
      return ColoredBox(
        color: AppColors.mapBg,
        child: AppStateView(
          icon: Icons.wifi_off_rounded,
          title: 'Could not load mosques',
          message: _error,
          onRetry: _load,
        ),
      );
    }

    final mosques = _filtered;
    final bottomPad = _selected == null ? 24.0 : 290.0;

    return Stack(
      children: [
        FlutterMap(
          mapController: _mapCtrl,
          options: MapOptions(
            initialCenter: _center,
            initialZoom: _zoom,
            onMapReady: () {
              _mapReady = true;
              _mapCtrl.move(_center, _zoom);
            },
            onTap: (_, _) {
              if (_selected != null) _clearSelection();
            },
          ),
          children: [
            TileLayer(
              urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              userAgentPackageName: 'com.mosque.mosque_app',
            ),
            MarkerLayer(
              markers: mosques.map((m) {
                final p = m.mapPoint;
                final selected = _selected?.id == m.id;
                final latest = _latestByMosque[m.id];
                final label = latest == null
                    ? 'Open'
                    : formatMoney(latest.amount);
                return Marker(
                  point: LatLng(p.lat, p.lng),
                  width: 92,
                  height: 78,
                  alignment: Alignment.bottomCenter,
                  child: MosqueMapMarker(
                    selected: selected,
                    label: label,
                    onTap: () => _selectMosque(m),
                  ),
                );
              }).toList(),
            ),
          ],
        ),

        // Search bar
        Positioned(
          top: MediaQuery.paddingOf(context).top + 8,
          left: 14,
          right: 14,
          child: _SearchBar(
            controller: _searchCtrl,
            onChanged: (v) => setState(() => _query = v),
            onClear: _clearSelection,
            suggestions: _query.isEmpty || _selected != null
                ? const []
                : mosques.take(6).toList(),
            onSuggestionTap: _selectMosque,
          ),
        ),

        // FABs
        Positioned(
          right: 14,
          bottom: bottomPad,
          child: Column(
            children: [
              _RoundFab(
                icon: Icons.explore_outlined,
                onTap: () {},
              ),
              const SizedBox(height: 10),
              _RoundFab(
                icon: Icons.my_location,
                iconColor: AppColors.locationBlue,
                onTap: _goToMyLocation,
              ),
            ],
          ),
        ),

        // Collection bottom card
        if (_selected != null)
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: MosqueCollectionCard(
              mosque: _selected!,
              collections: _selectedCollections,
              loading: _loadingCollections,
              onClose: _clearSelection,
            ),
          ),
      ],
    );
  }
}

class _SearchBar extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;
  final List<Mosque> suggestions;
  final ValueChanged<Mosque> onSuggestionTap;

  const _SearchBar({
    required this.controller,
    required this.onChanged,
    required this.onClear,
    required this.suggestions,
    required this.onSuggestionTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Material(
          elevation: 6,
          shadowColor: Colors.black26,
          borderRadius: BorderRadius.circular(28),
          color: Colors.white,
          child: SizedBox(
            height: 52,
            child: Row(
              children: [
                const SizedBox(width: 14),
                const CircleAvatar(
                  radius: 16,
                  backgroundColor: Color(0xFFE8F0EB),
                  child: Icon(Icons.person, size: 18, color: AppColors.forest),
                ),
                Container(
                  width: 1,
                  height: 28,
                  margin: const EdgeInsets.symmetric(horizontal: 10),
                  color: AppColors.line,
                ),
                const Icon(Icons.search, color: AppColors.inkMuted, size: 22),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: controller,
                    onChanged: onChanged,
                    style: Theme.of(context).textTheme.bodyLarge,
                    decoration: const InputDecoration(
                      hintText: 'Search mosque or location',
                      border: InputBorder.none,
                      isDense: true,
                    ),
                  ),
                ),
                if (controller.text.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    color: AppColors.inkMuted,
                    onPressed: () {
                      controller.clear();
                      onClear();
                    },
                  )
                else
                  const SizedBox(width: 12),
              ],
            ),
          ),
        ),
        if (suggestions.isNotEmpty) ...[
          const SizedBox(height: 8),
          Material(
            elevation: 4,
            borderRadius: BorderRadius.circular(16),
            color: Colors.white,
            child: ListView.separated(
              shrinkWrap: true,
              padding: const EdgeInsets.symmetric(vertical: 6),
              itemCount: suggestions.length,
              separatorBuilder: (_, _) => const Divider(height: 1),
              itemBuilder: (context, i) {
                final m = suggestions[i];
                return ListTile(
                  dense: true,
                  leading: const Icon(Icons.mosque, color: AppColors.forest),
                  title: Text(
                    m.name,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  subtitle: Text(m.location),
                  onTap: () => onSuggestionTap(m),
                );
              },
            ),
          ),
        ],
      ],
    );
  }
}

class _RoundFab extends StatelessWidget {
  final IconData icon;
  final Color? iconColor;
  final VoidCallback onTap;

  const _RoundFab({
    required this.icon,
    required this.onTap,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      elevation: 4,
      shadowColor: Colors.black26,
      shape: const CircleBorder(),
      child: InkWell(
        customBorder: const CircleBorder(),
        onTap: onTap,
        child: SizedBox(
          width: 48,
          height: 48,
          child: Icon(icon, color: iconColor ?? AppColors.gold, size: 24),
        ),
      ),
    );
  }
}
