import 'package:flutter/material.dart';

import '../theme/app_theme.dart';

class MosqueMapMarker extends StatelessWidget {
  final bool selected;
  final String label;
  final VoidCallback onTap;

  const MosqueMapMarker({
    super.key,
    required this.selected,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final badgeColor = selected ? AppColors.gold : AppColors.forest;

    return GestureDetector(
      onTap: onTap,
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.mosque,
            size: selected ? 36 : 30,
            color: AppColors.forestDark,
            shadows: const [
              Shadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 1)),
            ],
          ),
          const SizedBox(height: 2),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: badgeColor,
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 4,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
