import React, { useEffect, useState, useCallback } from 'react';
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
	Divider,
	Alert
} from '@mui/material';
import axios from 'axios';

interface Url {
	shortUrl: string;
	originalUrl: string;
	createdAt: string;
	clickCount: number;
	alias?: string;
}

interface Analytics {
	clickCount: number;
	lastIps: string[];
}

interface UrlListProps {
	fetchTrigger: number; // Числовой триггер для обновления списка
}

const UrlList: React.FC<UrlListProps> = ({ fetchTrigger }) => {
	const [urls, setUrls] = useState<Url[]>([]);
	const [analytics, setAnalytics] = useState<{ [key: string]: Analytics }>({});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const fetchUrls = useCallback(async () => {
		try {
			const response = await axios.get('http://localhost:3000/api/urls');
			console.log('URLs response:', response.data); // Для отладки
			setUrls(response.data);
			setAnalytics({}); // Очищаем аналитику при обновлении списка
		} catch (err) {
			console.error('Error fetching URLs:', err);
			setError('Не удалось загрузить список URL');
		}
	}, []);

	const fetchAnalytics = useCallback(
		async (shortUrl: string) => {
			try {
				if (!urls.find((url) => url.shortUrl === shortUrl)) {
					console.log(`Skipping analytics fetch for ${shortUrl} (not in urls)`);
					return;
				}
				console.log(`Fetching analytics for ${shortUrl}`);
				const response = await axios.get(
					`http://localhost:3000/api/analytics/${shortUrl}`
				);
				setAnalytics((prev) => ({ ...prev, [shortUrl]: response.data }));
			} catch (err) {
				console.error(`Analytics error for ${shortUrl}:`, err);
				setError(`Не удалось загрузить аналитику для ${shortUrl}`);
			}
		},
		[urls]
	);

	const handleDelete = async (shortUrl: string) => {
		try {
			await axios.delete(`http://localhost:3000/api/delete/${shortUrl}`);
			setUrls(urls.filter((url) => url.shortUrl !== shortUrl));
			setAnalytics((prev) => {
				const newAnalytics = { ...prev };
				delete newAnalytics[shortUrl];
				return newAnalytics;
			});
			setSuccess(`URL ${shortUrl} успешно удалён`);
			setTimeout(() => setSuccess(''), 3000); // Уведомление исчезает через 3 секунды
			fetchUrls(); // Обновляем список после удаления
		} catch (err: any) {
			setError(`Не удалось удалить ${shortUrl}`);
			console.log(err.response?.data?.message);
		}
	};

	useEffect(() => {
		fetchUrls();
	}, [fetchUrls, fetchTrigger]);

	useEffect(() => {
		urls.forEach((url) => fetchAnalytics(url.shortUrl));
	}, [fetchAnalytics, urls]);

	return (
		<Box my={2}>
			{error && <Alert severity='error'>{error}</Alert>}
			{success && <Alert severity='success'>{success}</Alert>}
			<Typography variant='h6'>Сокращенные URL</Typography>
			<List>
				{urls.map((url) => (
					<React.Fragment key={url.shortUrl}>
						<ListItem>
							<ListItemText
								primary={`Короткий URL: http://localhost:3000/api/${url.shortUrl}`}
								secondary={
									<>
										<Typography variant='body2'>
											Оригинальный: {url.originalUrl}
										</Typography>
										<Typography variant='body2'>
											Алиас: {url.alias || 'Не указан'}
										</Typography>
										<Typography variant='body2'>
											Создан: {new Date(url.createdAt).toLocaleString()}
										</Typography>
										<Typography variant='body2'>
											Клики: {url.clickCount}
										</Typography>
										{analytics[url.shortUrl] && (
											<Typography variant='body2'>
												Последние 5 IP:{' '}
												{analytics[url.shortUrl].lastIps.join(', ') ||
													'Нет данных'}
											</Typography>
										)}
									</>
								}
							/>
							<Button
								variant='contained'
								color='error'
								onClick={() => handleDelete(url.shortUrl)}>
								Удалить
							</Button>
						</ListItem>
						<Divider />
					</React.Fragment>
				))}
			</List>
		</Box>
	);
};

export default UrlList;
