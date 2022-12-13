// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const STREAK_DAYS_KEY = 'codingstreak.streakDays';
const STREAK_START_DATE_KEY = 'codingstreak.streakStartDate';
const STREAK_LAST_DATE_KEY = 'codingstreak.streakLastDate';

const DAYS_OFF_WEEK_CONFIG = 'codingstreak.daysOffWeek';

let streakStatusBarItem: vscode.StatusBarItem;

let streakDays: number;
let todayIsDayOff: boolean;

export function activate(context: vscode.ExtensionContext) {
	context.globalState.setKeysForSync([STREAK_DAYS_KEY, STREAK_START_DATE_KEY, STREAK_LAST_DATE_KEY]);

	// get days off
	let daysOffWeek: number[] = vscode.workspace.getConfiguration().get(DAYS_OFF_WEEK_CONFIG) || [];

	// check streak
	const currentDate = new Date();

	let streakStartDate: Date | undefined = context.globalState.get(STREAK_START_DATE_KEY);
	let streakLastDate: Date | undefined = context.globalState.get(STREAK_LAST_DATE_KEY);

	streakDays = context.globalState.get(STREAK_DAYS_KEY) || 0;
	
	if(streakStartDate == null || (streakLastDate != null && isStreakBroken(daysOffWeek, streakLastDate, currentDate))) {
		streakStartDate = currentDate;
		context.globalState.update(STREAK_START_DATE_KEY, streakStartDate);
		streakDays = 0;
		context.globalState.update(STREAK_DAYS_KEY, streakDays);
	}

	todayIsDayOff = isDayOff(daysOffWeek, currentDate);

	// Increment streak and how notification if it's the first time opening VSCode today
	if(streakLastDate === undefined || isFirstTimeToday(streakLastDate, currentDate)) {
		streakDays++;
		showStreak();
	}

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

	context.globalState.update(STREAK_DAYS_KEY, streakDays);
	context.globalState.update(STREAK_LAST_DATE_KEY, currentDate);
}

export function deactivate() {}

export function showStreak() {
	let msg = `You've been coding for ${streakDays} day(s) in a row. Keep it up!`;
	if(todayIsDayOff) {
		msg += '\nIt\'s a day off, remember to take some rest.';
	}
	vscode.window.showInformationMessage(msg);
}

export function isFirstTimeToday(streakLastDate: Date, currentDate: Date): boolean {
	const todayMidnight: Date = new Date(currentDate.setHours(0, 0, 0, 0));
	const streakLastDateMidnight: Date = new Date(new Date(streakLastDate).setHours(0, 0, 0, 0));
	return todayMidnight.getTime() !== streakLastDateMidnight.getTime();
}

export function isStreakBroken(daysOffWeek: number[], streakLastDate: Date, currentDate: Date): boolean {
	const todayMidnight: Date = new Date(currentDate.setHours(0, 0, 0, 0));
	const lastWorkDayMidnight: Date = new Date(getLastWorkDay(daysOffWeek, todayMidnight).setHours(0, 0, 0, 0));
	const streakLastDateMidnight: Date = new Date(new Date(streakLastDate).setHours(0, 0, 0, 0));
	return streakLastDateMidnight.getTime() !== todayMidnight.getTime()
		&& streakLastDateMidnight.getTime() < lastWorkDayMidnight.getTime();
}

export function getLastWorkDay(daysOffWeek: number[], todayMidnight: Date): Date {
	// Prevent infinite looping
	if([0, 1, 2, 3, 4, 5, 6].every(value => daysOffWeek.includes(value))) {
		console.warn("All week days are set as off days. No week day will be considered an off day.");
		daysOffWeek = [];
	}

	let lastWorkDayMidnight: Date = todayMidnight;
	while(true) {
		lastWorkDayMidnight = new Date(lastWorkDayMidnight.getTime() - 86400000); // TODO: Daylight savings
		if(!isDayOff(daysOffWeek, lastWorkDayMidnight)) {
			return lastWorkDayMidnight;
		}
	}
}

export function isDayOff(daysOffWeek: number[], date: Date): boolean {
	return daysOffWeek.includes(date.getDay());
}