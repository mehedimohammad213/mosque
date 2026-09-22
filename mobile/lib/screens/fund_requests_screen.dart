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
  late Future<List<FundRequest>> _future;

  @override
  void initState() {
    super.initState();
    _future = api.listFundRequests();
  }

  Future<void> _reload() async {
    setState(() => _future = api.listFundRequests());
    await _future;
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

                  final rows = snapshot.data ?? [];
                  if (rows.isEmpty) {
                    return const AppStateView(
                      icon: Icons.volunteer_activism_outlined,
                      title: 'No fund requests',
                      message: 'Fund needs will appear here when published.',
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
                                    child: Text(
                                      r.title,
                                      style:
                                          Theme.of(context).textTheme.titleLarge,
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
                                  color: AppColors.forest.withValues(alpha: 0.07),
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
                              const SizedBox(height: 10),
                              Text(
                                r.description,
                                style: Theme.of(context).textTheme.bodyLarge,
                              ),
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
