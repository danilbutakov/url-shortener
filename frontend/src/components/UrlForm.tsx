import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';

interface UrlResponse {
	shortUrl: string;
	originalUrl: string;
	alias?: string;
}

interface UrlFormProps {
	onUrlCreated: () => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onUrlCreated }) => {
	const [originalUrl, setOriginalUrl] = useState('');
	const [alias, setAlias] = useState('');
	const [expiresAt, setExpiresAt] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');
		try {
			const response = await axios.post<UrlResponse>(
				'http://localhost:3000/api/shorten',
				{
					originalUrl,
					alias: alias || undefined,
					expiresAt: expiresAt || undefined
				}
			);
			setSuccess(
				`Короткий URL создан: http://localhost:3000/api/${response.data.shortUrl}`
			);
			setOriginalUrl('');
			setAlias('');
			setExpiresAt('');
			onUrlCreated();
			setTimeout(() => setSuccess(''), 3000);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Не удалось создать URL');
		}
	};

	return (
		<Box component='form' onSubmit={handleSubmit} my={2}>
			{error && <Alert severity='error'>{error}</Alert>}
			{success && <Alert severity='success'>{success}</Alert>}
			<TextField
				label='Оригинальный URL'
				value={originalUrl}
				onChange={(e) => setOriginalUrl(e.target.value)}
				fullWidth
				margin='normal'
				required
			/>
			<TextField
				label='Алиас (опционально)'
				value={alias}
				onChange={(e) => setAlias(e.target.value)}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='Дата истечения (опционально)'
				type='datetime-local'
				value={expiresAt}
				onChange={(e) => setExpiresAt(e.target.value)}
				fullWidth
				margin='normal'
				InputLabelProps={{ shrink: true }}
			/>
			<Button type='submit' variant='contained' color='primary'>
				Сократить
			</Button>
		</Box>
	);
};

export default UrlForm;
