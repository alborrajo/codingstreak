import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as codingstreak from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test isFirstTimeToday', () => {
		assert.ok(codingstreak.isFirstTimeToday(new Date(2021, 10, 8), new Date(2021, 10, 10)));
		assert.ok(codingstreak.isFirstTimeToday(new Date(2021, 10, 9), new Date(2021, 10, 10)));
		assert.ok(!codingstreak.isFirstTimeToday(new Date(2021, 10, 10), new Date(2021, 10, 10)));
	});

	test('Test isStreakBroken', () => {
		assert.ok(codingstreak.isStreakBroken(new Date(2021, 10, 8), new Date(2021, 10, 10)));
		assert.ok(!codingstreak.isStreakBroken(new Date(2021, 10, 9), new Date(2021, 10, 10)));
		assert.ok(!codingstreak.isStreakBroken(new Date(2021, 10, 10), new Date(2021, 10, 10)));
	});

	test('Test calculateStreakDays', () => {
		assert.strictEqual(codingstreak.calculateStreakDays(new Date(2021, 10, 1), new Date(2021, 10, 10)), 10);
		assert.strictEqual(codingstreak.calculateStreakDays(new Date(2021, 10, 9), new Date(2021, 10, 10)), 2);
		assert.strictEqual(codingstreak.calculateStreakDays(new Date(2021, 10, 10), new Date(2021, 10, 10)), 1);
	});
});
