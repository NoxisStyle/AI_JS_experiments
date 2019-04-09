

class VectorUtils
{
    // function to make a random choice
    // equivalent of numpy.random.choice()
    // The probabilities associated with each entry in p
    static randomChoice(p) 
    {
        let rnd = p.reduce( (a, b) => a + b ) * Math.random();
        return p.findIndex( a => (rnd -= a) < 0 );
    }

    // compute the sum
    static sum(values)
    {
        let sum = values.reduce(function(a, b) { return a + b; });
        return sum;
    }

    static max(values)
    {
        let max = values.reduce(function(a, b) { return ((a > b)?a : b); });
        return max;
    }

    // Compute the mean of the array
    static mean(values)
    {
        if (values.length == 0)
            return 0;
        let sum = values.reduce(function(a, b) { return a + b; });
        let average = sum / values.length;
        return average;
    }

    // compute the standard deviation
    static std(values)
    {
        let avg = this.mean(values);
        
        let squareDiffs = values.map(function(value){
            let diff = value - avg;
            return (diff * diff);
        });
        
        let avgSquareDiff = this.mean(squareDiffs);
        
        let stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    }
}