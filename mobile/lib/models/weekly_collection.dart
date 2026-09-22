class WeeklyCollection {
  final int id;
  final int mosqueId;
  final String weekStartDate;
  final String weekEndDate;
  final String amount;
  final String? note;
  final String status;

  const WeeklyCollection({
    required this.id,
    required this.mosqueId,
    required this.weekStartDate,
    required this.weekEndDate,
    required this.amount,
    this.note,
    required this.status,
  });

  factory WeeklyCollection.fromJson(Map<String, dynamic> json) {
    return WeeklyCollection(
      id: json['id'] as int,
      mosqueId: json['mosque_id'] as int,
      weekStartDate: json['week_start_date'] as String? ?? '',
      weekEndDate: json['week_end_date'] as String? ?? '',
      amount: json['amount']?.toString() ?? '0',
      note: json['note'] as String?,
      status: json['status'] as String? ?? '',
    );
  }
}
