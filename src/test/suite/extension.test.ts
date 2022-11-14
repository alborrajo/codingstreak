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

	test('Test isDayOff', () => {
		assert.ok(!codingstreak.isDayOff([], new Date()));
		assert.ok(codingstreak.isDayOff([0,1,2,3,4,5,6], new Date()));
		assert.ok(codingstreak.isDayOff([0,6], new Date(2022, 10, 12)));
		assert.ok(codingstreak.isDayOff([0,6], new Date(2022, 10, 13)));
		assert.ok(!codingstreak.isDayOff([0,6], new Date(2022, 10, 14)));
	});

	test('Test getLastWorkDay', () => {
		assert.deepStrictEqual(codingstreak.getLastWorkDay([], new Date(2022, 10, 14)), new Date(2022, 10, 13));
		assert.deepStrictEqual(codingstreak.getLastWorkDay([0,1,2,3,4,5,6], new Date(2022, 10, 14)), new Date(2022, 10, 13));
		assert.deepStrictEqual(codingstreak.getLastWorkDay([0,6], new Date(2022, 10, 14)), new Date(2022, 10, 11));
	});

	test('Test isStreakBroken', () => {
		assert.ok(codingstreak.isStreakBroken([], new Date(2021, 10, 8), new Date(2021, 10, 10)));
		assert.ok(!codingstreak.isStreakBroken([], new Date(2021, 10, 9), new Date(2021, 10, 10)));
		assert.ok(!codingstreak.isStreakBroken([], new Date(2021, 10, 10), new Date(2021, 10, 10)));
		assert.ok(!codingstreak.isStreakBroken([0,6], new Date(2022, 10, 11), new Date(2022, 10, 14)));
		assert.ok(codingstreak.isStreakBroken([0,6], new Date(2022, 10, 10), new Date(2022, 10, 14)));
	});
});
