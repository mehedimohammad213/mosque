import 'package:flutter/material.dart';

import '../models/fund_request.dart';
import '../services/api_client.dart';
import '../theme/app_theme.dart';
import '../widgets/common.dart';

class FundRequestsScreen extends StatefulWidget {
  const FundRequestsScreen({super.key});

  @override
  State<FundRequestsScreen> createState() => _FundRequestsScreenState();
}

class _FundRequestsScreenState extends State<FundRequestsScreen> {
  final _searchCtrl = TextEditingController();
  late Future<List<FundRequest>> _future;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _future = api.listFundRequests();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _reload() async {
    setState(() => _future = api.listFundRequests());
    await _future;
  }

  void _clearSearch() {
    _searchCtrl.clear();
    setState(() => _query = '');
  }

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: AppColors.surface,
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Fund Requests',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Amount and details for each request',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 14),
                  _FundSearchField(
                    controller: _searchCtrl,
                    onChanged: (v) => setState(() => _query = v),
                    onClear: _clearSearch,
                  ),
                ],
              ),
            ),
            Expanded(
              child: FutureBuilder<List<FundRequest>>(
                future: _future,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  }
                  if (snapshot.hasError) {
                    return AppStateView(
                      icon: Icons.wifi_off_rounded,
                      title: 'Could not load fund requests',
                      message: '${snapshot.error}',
                      onRetry: _reload,
                    );
                  }

                  final all = snapshot.data ?? [];
                  final rows =
                      all.where((r) => r.matchesQuery(_query)).toList();

                  if (all.isEmpty) {
                    return const AppStateView(
                      icon: Icons.volunteer_activism_outlined,
                      title: 'No fund requests',
                      message: 'Fund needs will appear here when published.',
                    );
                  }

                  if (rows.isEmpty) {
                    return AppStateView(
                      icon: Icons.search_off_rounded,
                      title: 'No matches',
                      message: 'Nothing found for “$_query”. Clear search to see all.',
                    );
                  }

                  return RefreshIndicator(
                    color: AppColors.forest,
                    onRefresh: _reload,
                    child: ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                      itemCount: rows.length,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) {
                        final r = rows[index];
                        return SoftPanel(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        if (r.mosqueName != null &&
                                            r.mosqueName!.isNotEmpty) ...[
                                          Text(
                                            r.mosqueName!,
                                            style: Theme.of(context)
                                                .textTheme
                                                .titleSmall
                                                ?.copyWith(
                                                  color: AppColors.forest,
                                                  fontWeight: FontWeight.w800,
                                                ),
                                          ),
                                          const SizedBox(height: 4),
                                        ],
                                        Text(
                                          r.title,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleLarge,
                                        ),
                                      ],
                                    ),
                                  ),
                                  StatusBadge(status: r.status),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color:
                                      AppColors.forest.withValues(alpha: 0.07),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  formatMoney(r.requiredAmount),
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineSmall
                                      ?.copyWith(color: AppColors.forest),
                                ),
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Details',
                                style: Theme.of(context).textTheme.titleSmall,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                r.description,
                                style: Theme.of(context).textTheme.bodyLarge,
                              ),
                              const SizedBox(height: 12),
                              Text(
                                'Account number',
                                style: Theme.of(context).textTheme.titleSmall,
                              ),
                              const SizedBox(height: 4),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 10,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppColors.line),
                                ),
                                child: Row(
                                  children: [
                                    const Icon(
                                      Icons.account_balance_wallet_outlined,
                                      size: 18,
                                      color: AppColors.forest,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        r.accountNumber?.isNotEmpty == true
                                            ? '${r.accountLabel} · ${r.accountNumber}'
                                            : 'Not available',
                                        style: Theme.of(context)
                                            .textTheme
                                            .bodyLarge
                                            ?.copyWith(
                                              fontWeight: FontWeight.w700,
                                            ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              if (r.bankName != null &&
                                  r.bankName!.isNotEmpty) ...[
                                const SizedBox(height: 6),
                                Text(
                                  r.bankName!,
                                  style: Theme.of(context).textTheme.bodySmall,
                                ),
                              ],
                              const SizedBox(height: 10),
                              Text(
                                'Year ${r.fundYear}'
                                '${r.contactPerson != null ? ' · ${r.contactPerson}' : ''}',
                                style: Theme.of(context).textTheme.bodySmall,
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FundSearchField extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;

  const _FundSearchField({
    required this.controller,
    required this.onChanged,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      elevation: 2,
      shadowColor: Colors.black12,
      borderRadius: BorderRadius.circular(14),
      color: Colors.white,
      child: SizedBox(
        height: 48,
        child: Row(
          children: [
            const SizedBox(width: 14),
            const Icon(Icons.search, color: AppColors.inkMuted, size: 22),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: controller,
                onChanged: onChanged,
                style: Theme.of(context).textTheme.bodyLarge,
                decoration: const InputDecoration(
                  hintText: 'Search mosque, title, account…',
                  border: InputBorder.none,
                  isDense: true,
                ),
              ),
            ),
            if (controller.text.isNotEmpty)
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                color: AppColors.inkMuted,
                onPressed: onClear,
              )
            else
              const SizedBox(width: 12),
          ],
        ),
      ),
    );
  }
}
