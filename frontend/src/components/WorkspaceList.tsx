import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom'; // 👈 add this
import api from "../api/axios";
import { toast } from "react-toastify";



export interface FolderType {
  id: number;
  name: string;
  description: string;
  docs: number;
  color?: string;
}

const WSCard = styled('div')<{ headercolor: string }>(({ theme, headercolor }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  boxShadow: theme.shadows[1],
  '& .header': {
    backgroundColor: headercolor,
    padding: theme.spacing(2),
  },
  '& .body': {
    flex: 1,
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

interface Props {
  folders: FolderType[];
}

type OpenWorkspaceResponse = {
  folderId: string;
}





export default function WorkspaceList({ folders }: Props) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate(); //for navigation

  const handleOpenWorkspace = async (ws: FolderType) => {
    try {
      // Use ws.id as folderId
      const response = await api.post<OpenWorkspaceResponse>(`/folder/open?folderId=${ws.id}`);
      console.log("Successfully opened Workspace");
      // You can use ws or response.data.folderId here
      navigate(`/workbook/${ws.id}`, { state: ws });
    } catch (error: any) {
      const apiError = error.response?.data?.error;
      const fallback = "Could not open the workspace";
      const message = typeof apiError === 'string' ? apiError : fallback;

      console.error("Workspace opening error:", message);

      toast.error(`❌ ${message}`, {
        position: "top-center",
        autoClose: 4000,
      });
    }
  };

  return (
    <Grid container spacing={3}>
      {folders.map(ws => {
        const rawColor = ws.color
          ? ws.color
          : (isDark ? '#555555' : '#E3F64D');
        const headerColor = isDark
          ? alpha(rawColor, 0.2)
          : rawColor;
        return (
          <Grid key={ws.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <WSCard headercolor={headerColor}
            onClick={() => handleOpenWorkspace(ws)} >
              <Box className="header">
                <Typography variant="subtitle1" fontWeight={600}>
                  {ws.name}
                </Typography>
              </Box>
              <Box className="body">
                <Typography variant="body2" color="text.secondary">
                  {ws.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <FolderOpenIcon fontSize="small" color="action" />
                    <Typography variant="caption">{ws.docs} documents</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon fontSize="small" color="action" />
                  </Box>
                </Box>
              </Box>
            </WSCard>
          </Grid>
        );
      })}
    </Grid>
  );
}
