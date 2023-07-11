import  winston  from "winston";

// Error type and level
const customLevels = {
    levels: {
        trace: 5,
        debug: 4,
        info: 3,
        warn: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        trace: 'white',
        debug: 'green',
        info: 'white',
        warn: 'yellow',
        error: 'red',
        fatal: 'red',
    },
};

// Custom logger class
class Logger {

    constructor() {
        const rightNow = new Date();
        const res = rightNow.toISOString().slice(0, 10).replace(/-/g, "_");
        const transport = new winston.transports.Console();
        this.logger = winston.createLogger({
            level: "info",
            levels: customLevels.levels,
            transports: [
                new winston.transports.File({

                    filename: `logs/${res}/combined.log`,
                    level: 'info',
                    colors: 'white',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                })
            ],
        });
        winston.addColors(customLevels.colors);
    }

    trace(msg, meta) {
        this.logger.log('trace', msg, meta);
    }

    debug(msg, meta) {
        this.logger.debug(msg, meta);
    }

    info(msg, meta) {
        this.logger.info(msg, meta);
    }

    warn(msg, meta) {
        this.logger.warn(msg, meta);
    }

    error(msg, meta) {
        this.logger.error(msg, meta);
    }

    fatal(msg, meta) {
        this.logger.log('fatal', msg, meta);
    }
}

export const logger = new Logger();
