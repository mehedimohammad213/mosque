import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:mosque_app/main.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUpAll(() async {
    await dotenv.load(fileName: '.env');
  });

  testWidgets('App shows map and fund request tabs', (WidgetTester tester) async {
    await tester.pumpWidget(const MosqueApp());

    expect(find.text('Map'), findsOneWidget);
    expect(find.text('Fund Requests'), findsOneWidget);
  });
}
