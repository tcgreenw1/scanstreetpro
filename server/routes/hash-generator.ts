import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

const router = Router();

// POST /api/generate-hash - Generate password hash for testing
router.post('/generate-hash', async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Password is required'
      });
    }
    
    const hash = await bcrypt.hash(password, 12);
    
    res.json({
      success: true,
      data: {
        password,
        hash
      }
    });
    
  } catch (error: any) {
    console.error('Hash generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hash'
    });
  }
});

export default router;
