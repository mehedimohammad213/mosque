import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Matches reference: deep green mosque markers + gold selection accents.
class AppColors {
  static const forest = Color(0xFF1A5C3A);
  static const forestDark = Color(0xFF0F3D28);
  static const forestMid = Color(0xFF217048);
  static const gold = Color(0xFFA67C3D);
  static const goldDeep = Color(0xFF8B6430);
  static const goldSoft = Color(0xFFD4C4A8);
  static const ink = Color(0xFF1A1F1C);
  static const inkMuted = Color(0xFF6B736E);
  static const surface = Color(0xFFF4F6F5);
  static const surfaceElevated = Color(0xFFFFFFFF);
  static const line = Color(0xFFE2E8E4);
  static const mapBg = Color(0xFFE8ECE9);
  static const danger = Color(0xFF9B3B3B);
  static const warn = Color(0xFF8A6A2F);
  static const ok = Color(0xFF1A5C3A);
  static const locationBlue = Color(0xFF2F80ED);
}

class AppTheme {
  static ThemeData light() {
    final base = ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.surface,
    );

    final textTheme = GoogleFonts.manropeTextTheme(base.textTheme).copyWith(
      headlineMedium: GoogleFonts.manrope(
        fontSize: 22,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
      ),
      headlineSmall: GoogleFonts.manrope(
        fontSize: 18,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
      ),
      titleLarge: GoogleFonts.manrope(
        fontSize: 17,
        fontWeight: FontWeight.w800,
        color: AppColors.ink,
      ),
      titleMedium: GoogleFonts.manrope(
        fontSize: 15,
        fontWeight: FontWeight.w700,
        color: AppColors.ink,
      ),
      titleSmall: GoogleFonts.manrope(
        fontSize: 12,
        fontWeight: FontWeight.w700,
        color: AppColors.inkMuted,
        letterSpacing: 0.2,
      ),
      bodyLarge: GoogleFonts.manrope(
        fontSize: 15,
        fontWeight: FontWeight.w500,
        color: AppColors.ink,
        height: 1.4,
      ),
      bodyMedium: GoogleFonts.manrope(
        fontSize: 13,
        fontWeight: FontWeight.w500,
        color: AppColors.inkMuted,
        height: 1.4,
      ),
      bodySmall: GoogleFonts.manrope(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: AppColors.inkMuted,
      ),
      labelLarge: GoogleFonts.manrope(
        fontSize: 14,
        fontWeight: FontWeight.w800,
        color: AppColors.surfaceElevated,
      ),
    );

    return base.copyWith(
      colorScheme: const ColorScheme.light(
        primary: AppColors.forest,
        onPrimary: AppColors.surfaceElevated,
        secondary: AppColors.gold,
        onSecondary: AppColors.surfaceElevated,
        surface: AppColors.surfaceElevated,
        onSurface: AppColors.ink,
        outline: AppColors.line,
        error: AppColors.danger,
      ),
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: AppColors.ink,
        titleTextStyle: GoogleFonts.manrope(
          fontSize: 18,
          fontWeight: FontWeight.w800,
          color: AppColors.ink,
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        elevation: 8,
        height: 64,
        backgroundColor: AppColors.surfaceElevated,
        indicatorColor: AppColors.forest.withValues(alpha: 0.12),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return GoogleFonts.manrope(
            fontSize: 11,
            fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
            color: selected ? AppColors.forest : AppColors.inkMuted,
          );
        }),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(
            size: 22,
            color: selected ? AppColors.forest : AppColors.inkMuted,
          );
        }),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.forest,
          foregroundColor: AppColors.surfaceElevated,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
          textStyle: GoogleFonts.manrope(
            fontSize: 14,
            fontWeight: FontWeight.w800,
          ),
        ),
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.forest,
      ),
    );
  }
}
