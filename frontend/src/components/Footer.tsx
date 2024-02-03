import { Box, Container, Link, Typography } from "@mui/material";

export default function Footer() {
    return <Box
    component="footer"
    sx={{
      py: 3,
      px: 2,
      mt: 'auto',
    }}
  >
    <Container maxWidth="sm">
      <Typography variant="body1" sx={{ textAlign: 'center'}}>
        Made with ✨ by Chrome DevRel / <Link href="https://twitter.com/andreban/">@andreban</Link>.
      </Typography>
    </Container>
  </Box>
}