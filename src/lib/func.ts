import random from 'random';

export function StringENC(text: string) {
	return btoa(Buffer.from(text, 'utf8').toString('hex'));
}

export function StringDEC(base64: string) {
	return Buffer.from(atob(base64), 'hex').toString('utf8');
}

export function genCoef() {
	const a = random.int(1, 1000);
	let coef: number;

	if (a <= 500) {
		// 50%: 1.77x – 3.22x
		coef = random.int(177, 322) / 100;
	} else if (a <= 850) {
		// 35%: 3.23x – 7.99x
		coef = random.int(323, 799) / 100;
	} else {
		// 15%: 8.00x – 15.99x
		coef = random.int(800, 1599) / 100;
	}

	return coef;
}
