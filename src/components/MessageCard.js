import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Link,
} from "@mui/material";
import {
  Phone,
  Email,
  LocationOn,
  Language,
  GTranslate,
  Group,
  Person,
  CalendarToday,
  CheckCircle,
  Block,
  Delete,
} from '@mui/icons-material';

const formatTimestamp = (ts) => {
  if (!ts) return 'N/A';
  return new Date(ts * 1000).toLocaleString('ru-RU');
};

const MessageCard = ({ message, isSentByUser }) => {
  const cardStyle = {
    mb: 2,
    maxWidth: '85%',
    alignSelf: isSentByUser ? 'flex-end' : 'flex-start',
    backgroundColor: isSentByUser ? '#dcf8c6' : '#ffffff',
    border: '1px solid #e0e0e0',
  };

  return (
    <Card sx={cardStyle} elevation={1}>
      <CardContent sx={{ p: '12px !important' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
            {message.name_of_sender || 'Unknown Sender'}
          </Typography>
          <Chip label={message.app || 'N/A'} size="small" variant="outlined" />
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: 2 }}>
          {message.message_content}
        </Typography>

        {message.translated_text && (
          <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
            <Typography variant="caption" display="flex" alignItems="center" color="text.secondary">
              <GTranslate sx={{ mr: 0.5 }} fontSize="small" /> Перевод:
            </Typography>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              {message.translated_text}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 1.5 }} />

        <Box>
          <Typography variant="caption" color="text.secondary" component="div" gutterBottom>
            Детали:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {message.group_name && (
              <Chip icon={<Group />} label={`Группа: ${message.group_name}`} size="small" />
            )}
            <Chip 
              icon={<Person />} 
              label={`Получатель: ${message.name_of_receiver || 'N/A'}`} 
              size="small" 
            />
            <Chip 
              icon={<CalendarToday />} 
              label={formatTimestamp(message.status_timestamp)} 
              size="small" 
            />
            <Chip
              icon={message.message_status === 'read' ? <CheckCircle /> : <Block />}
              label={`Статус: ${message.message_status || 'N/A'}`}
              size="small"
              color={message.message_status === 'read' ? 'success' : 'default'}
            />
            {message.is_deleted && (
              <Chip icon={<Delete />} label="Удалено" color="error" size="small" />
            )}
            {message.email && <Chip icon={<Email />} label={message.email} size="small" />}
            {message.phone && <Chip icon={<Phone />} label={message.phone} size="small" />}
            {message.source_language && (
              <Chip 
                icon={<Language />} 
                label={`Язык: ${message.source_language}`} 
                size="small" 
              />
            )}
            {message.location_of_sender?.lat && (
              <Link
                href={`https://www.google.com/maps/search/?api=1&query=${message.location_of_sender.lat},${message.location_of_sender.lon}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Chip icon={<LocationOn />} label="Местоположение" clickable size="small" />
              </Link>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MessageCard;