import type { NextApiRequest, NextApiResponse} from 'next'

type HealthResponse = {
    status: string
}

export default (_: NextApiRequest, res: NextApiResponse<HealthResponse>) => {
    res.status(200).json({ status: 'OK' })
  }