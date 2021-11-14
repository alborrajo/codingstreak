// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const STREAK_START_DATE_KEY = 'codingstreak.streakStartDate';
const STREAK_LAST_DATE_KEY = 'codingstreak.streakLastDate';

let streakStatusBarItem: vscode.StatusBarItem;

let streakDays = 1;

export function activate(context: vscode.ExtensionContext) {
	context.globalState.setKeysForSync([STREAK_START_DATE_KEY, STREAK_LAST_DATE_KEY]);

	const currentDate = new Date();

	// calculate streak days
	let streakStartDate: Date | undefined = context.globalState.get(STREAK_START_DATE_KEY);
	let streakLastDate: Date | undefined = context.globalState.get(STREAK_LAST_DATE_KEY);

	if(streakStartDate === undefined || (streakLastDate !== undefined && isStreakBroken(streakLastDate, currentDate))) {
		streakStartDate = currentDate;
		context.globalState.update(STREAK_START_DATE_KEY, streakStartDate);
	}

	streakDays = calculateStreakDays(streakStartDate, currentDate);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableRegisteredCommand = vscode.commands.registerCommand('codingstreak.show', showStreak);
	context.subscriptions.push(disposableRegisteredCommand);

	// create status bar item
	streakStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	streakStatusBarItem.command = 'codingstreak.show';
	streakStatusBarItem.text = `$(flame)${streakDays}`;
	context.subscriptions.push(streakStatusBarItem);

	streakStatusBarItem.show();

	// Show notification if it's the first time opening VSCode today
	if(streakLastDate === undefined || isFirstTimeToday(streakLastDate, currentDate)) {
		showStreak();
	}

	context.globalState.update(STREAK_LAST_DATE_KEY, currentDate);
}

export function deactivate() {}

function showStreak() {
	// The code you place here will be executed every time your command is executed
	// Display a message box to the user
	vscode.window.showInformationMessage(`You've been coding for ${streakDays} day(s) in a row. Keep it up!`);
}

export function isFirstTimeToday(streakLastDate: Date, currentDate: Date): boolean {
	const todayMidnight: Date = new Date(currentDate.setHours(0, 0, 0, 0));
	const streakLastDateMidnight: Date = new Date(new Date(streakLastDate).setHours(0, 0, 0, 0));
	return todayMidnight.getTime() !== streakLastDateMidnight.getTime();
}

export function isStreakBroken(streakLastDate: Date, currentDate: Date): boolean {
	const todayMidnight: Date = new Date(currentDate.setHours(0, 0, 0, 0));
	const yesterdayMidnight: Date = new Date(todayMidnight.getTime() - 86400000);
	const streakLastDateMidnight: Date = new Date(new Date(streakLastDate).setHours(0, 0, 0, 0));
	return todayMidnight.getTime() !== streakLastDateMidnight.getTime()
		&& yesterdayMidnight.getTime() !== streakLastDateMidnight.getTime();
}

export function calculateStreakDays(streakStartDate: Date, currentDate: Date): number {
	const todayMidnight: Date = new Date(currentDate.setHours(0, 0, 0, 0));
	const streakStartDateMidnight: Date = new Date(new Date(streakStartDate).setHours(0, 0, 0, 0));
	return Math.floor((todayMidnight.getTime() - streakStartDateMidnight.getTime()) / 86400000) + 1;
}