import React, { useCallback, useState } from 'react';
import { Container, Typography } from '@mui/material';
import UrlForm from './components/UrlForm';
import UrlList from './components/UrlList';

const App: React.FC = () => {
	const [fetchTrigger, setFetchTrigger] = useState(0);

	const triggerFetchUrls = useCallback(() => {
		setFetchTrigger((prev) => prev + 1); // Увеличиваем триггер для обновления списка
	}, []);

	return (
		<Container maxWidth='md'>
			<Typography variant='h4' align='center' my={4}>
				Сервис сокращения URL
			</Typography>
			<UrlForm onUrlCreated={triggerFetchUrls} />
			<UrlList fetchTrigger={fetchTrigger} />
		</Container>
	);
};

export default App;
