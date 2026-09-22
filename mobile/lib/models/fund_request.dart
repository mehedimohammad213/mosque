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
  });

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
    );
  }
}
