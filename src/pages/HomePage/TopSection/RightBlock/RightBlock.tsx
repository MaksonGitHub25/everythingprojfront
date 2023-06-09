import React from 'react';
import styles from './RightBlock.module.scss';

export default function RightBlock() {
	return (
		<div id={styles['right-text-block-wrapper']}>
			<p id={styles['top-section-title-right']}>
				Here you can buy what
				<br />
				when
				<br />
				where
				<br />
				by price
			</p>
			<p id={styles['top-section-curly-brackets']}>{'}'}</p>
			<p id={styles['second-part-title-right']}>you want</p>
		</div>
	);
}
