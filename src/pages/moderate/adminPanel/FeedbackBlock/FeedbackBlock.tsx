import { FeedbackType } from '@/pages/types/feedbackTypes';
import FeedbackRow from './FeedbackRow/FeedbackRow';
import styles from './FeedbackBlock.module.scss';

interface Props {
	feedbacks: FeedbackType;
}

export default function FeedbackBlock({ feedbacks }: Props) {
	return (
		<div id={styles['users-data-block']}>
			<p id={styles['block-title']}>Feedbacks</p>
			<div id={styles['users-list']}>
				{feedbacks.map((feedback, index) => {
					return <FeedbackRow feedback={feedback} key={index} />;
				})}
			</div>
		</div>
	);
}