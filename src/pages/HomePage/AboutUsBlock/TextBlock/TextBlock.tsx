import styles from './TextBlock.module.css';

export default function TextBlock() {
	return (
		<>
			<div className="pb-4">
				<p id={styles['our-experience-subtitle']}>About Us</p>
				<p id={styles['our-experience-title']}>Our experience wonder</p>
			</div>
			<div id={styles['text-block-wrapper']} className='max-sm:w-fit'>
				<div id={styles['text-block-line']}></div>
				<div className="p-4 max-sm:break-words">
					<p id={styles['text-block-text']}>
						We have around 25 years experience in this business. Our employee
						are professional workers, who can help you with your issues whenever
					</p>
				</div>
			</div>
		</>
	);
}