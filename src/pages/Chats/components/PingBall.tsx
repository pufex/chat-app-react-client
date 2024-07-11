type PingBallProps = {
    count: number
}

const PingBall = ({count}: PingBallProps) => {
    if(count > 0)
    return <div className="ping-ball">
        <span className="ping-ball__count">
            {count}
        </span>
    </div>

    else return null
}

export default PingBall
