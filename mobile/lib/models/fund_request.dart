class FundRequest {
  final int id;
  final int mosqueId;
  final String title;
  final String description;
  final int fundYear;
  final String requiredAmount;
  final String? startDate;
  final String? neededBy;
  final String? contactPerson;
  final String? contactPhone;
  final String status;
  final String? mosqueName;
  final String? accountType;
  final String? accountName;
  final String? accountNumber;
  final String? bankName;

  const FundRequest({
    required this.id,
    required this.mosqueId,
    required this.title,
    required this.description,
    required this.fundYear,
    required this.requiredAmount,
    this.startDate,
    this.neededBy,
    this.contactPerson,
    this.contactPhone,
    required this.status,
    this.mosqueName,
    this.accountType,
    this.accountName,
    this.accountNumber,
    this.bankName,
  });

  String get accountLabel {
    final type = accountType?.trim();
    if (type == null || type.isEmpty) return 'Account';
    return type[0].toUpperCase() + type.substring(1);
  }

  bool matchesQuery(String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return true;
    return title.toLowerCase().contains(q) ||
        description.toLowerCase().contains(q) ||
        status.toLowerCase().contains(q) ||
        '$fundYear'.contains(q) ||
        requiredAmount.toLowerCase().contains(q) ||
        (mosqueName?.toLowerCase().contains(q) ?? false) ||
        (accountNumber?.toLowerCase().contains(q) ?? false) ||
        (accountType?.toLowerCase().contains(q) ?? false) ||
        (bankName?.toLowerCase().contains(q) ?? false) ||
        (contactPerson?.toLowerCase().contains(q) ?? false) ||
        (contactPhone?.toLowerCase().contains(q) ?? false);
  }

  factory FundRequest.fromJson(Map<String, dynamic> json) {
    return FundRequest(
      id: json['id'] as int,
      mosqueId: json['mosque_id'] as int,
      title: json['title'] as String? ?? '',
      description: json['description'] as String? ?? '',
      fundYear: json['fund_year'] is int
          ? json['fund_year'] as int
          : int.tryParse('${json['fund_year']}') ?? 0,
      requiredAmount: json['required_amount']?.toString() ?? '0',
      startDate: json['start_date'] as String?,
      neededBy: json['needed_by'] as String?,
      contactPerson: json['contact_person'] as String?,
      contactPhone: json['contact_phone'] as String?,
      status: json['status'] as String? ?? '',
      mosqueName: json['mosque_name'] as String?,
      accountType: json['account_type'] as String?,
      accountName: json['account_name'] as String?,
      accountNumber: json['account_number'] as String?,
      bankName: json['bank_name'] as String?,
    );
  }
}
