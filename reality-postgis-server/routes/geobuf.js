const sm = require('@mapbox/sphericalmercator')
const merc = new sm({
  size: 256
})

// route query
const sql = (params, query) => {
  let bounds = query.bounds ? query.bounds.split(',').map(Number) : null
  bounds && bounds.length === 3
    ? (bounds = merc.bbox(bounds[1], bounds[2], bounds[0]))
    : null

  return `

  SELECT 
    ST_AsGeobuf(q, 'geom')
  
  FROM
  (

    SELECT
      ST_Transform(${query.geom_column}, 4326) as geom
      ${query.columns ? `, ${query.columns}` : ''}

    FROM
      ${params.table}
      ${
        bounds
          ? `, (SELECT ST_SRID(${query.geom_column}) as srid FROM ${
              params.table
            } LIMIT 1) sq`
          : ''
      }

    -- Optional Filter
    ${query.filter || bounds ? 'WHERE' : ''}
    ${query.filter ? `${query.filter}` : ''}
    ${query.filter && bounds ? 'AND' : ''}
    ${
      bounds
        ? `      
          ${query.geom_column} &&
          ST_Transform(
            ST_MakeEnvelope(${bounds.join()}, 4326), 
            srid
          )      
        `
        : ''
    }

  ) as q; 

  `
}

// route schema
const schema = {
  description: 'Return records as Geobuf, a protobuf encoding of GeoJSON.',
  tags: ['feature'],
  summary: 'return Geobuf',
  params: {
    table: {
      type: 'string',
      description: 'The name of the table or view.'
    }
  },
  querystring: {
    geom_column: {
      type: 'string',
      description: 'The geometry column of the table.',
      default: 'geom'
    },
    columns: {
      type: 'string',
      description:
        'Columns to return as GeoJSON properites. The default is geometry only. <br/><em>Note: the geometry column should not be listed here, and columns must be explicitly named.</em>'
    },
    filter: {
      type: 'string',
      description: 'Optional filter parameters for a SQL WHERE statement.'
    },
    bounds: {
      type: 'string',
      pattern:
        '^-?[0-9]{0,20}.?[0-9]{1,20}?(,-?[0-9]{0,20}.?[0-9]{1,20}?){2,3}$',
      description:
        'Optionally limit output to features that intersect bounding box. Can be expressed as a bounding box (sw.lng, sw.lat, ne.lng, ne.lat) or a Z/X/Y tile (0,0,0).'
    }
  }
}

// create route
module.exports = function(fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/geobuf/:table',
    schema: schema,
    handler: function(request, reply) {
      fastify.pg.connect(onConnect)

      function onConnect(err, client, release) {
        if (err)
          return reply.send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'unable to connect to database server'
          })

        client.query(sql(request.params, request.query), function onResult(
          err,
          result
        ) {
          release()
          if (err) {
            reply.send(err)
          } else {
            if (!result.rows[0].st_asgeobuf) {
              reply.code(204)
            }
            reply
              .header('Content-Type', 'application/x-protobuf')
              .send(result.rows[0].st_asgeobuf)
          }
        })
      }
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
