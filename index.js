import React, { Component } from "react";
import { db } from '../../firebase';
import axios from 'axios';
import './index.css';

class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempArray: [],
            tempoftemp: [],
            keys: [],
            activeContent: [],
            start: true,
            body: [],
            currentCount: 60,
            i: 0,
            first: true,
        };
    }

    start() {

        db.getActiveList().then(snapshot => {
            if (snapshot.val() === null) {
                this.setState({ activeContent: "" })
            }
            else if (this.state.first){
                this.setState({ tempArray: [...this.state.tempArray, snapshot.val()] })
                this.setState({ reachedActive: true })
                {
                    Object.keys(this.state.tempArray).map((key, index) =>
                        this.setState({ tempoftemp: [...this.state.tempoftemp, this.state.tempArray[index]] })
                    )
                }
                {
                    Object.keys(this.state.tempoftemp).map((key) =>
                        this.setState({ keys: this.state.tempoftemp[key] })
                    )
                    Object.keys(this.state.keys).map((key) =>
                        this.setState({ activeContent: [...this.state.activeContent, this.state.keys[key]] })
                    )
                    this.setState({first: false})
                }
            }
        });
        if (this.state.i >= this.state.activeContent.length)
        {
            this.setState({i: 0})
        }
        db.getHTMLBody(this.state.activeContent[this.state.i].id).then(snapshot => {
            this.setState({ body: snapshot.val() })
        })
    }
    getRSS(key) {
        this.setState({ contentKey: key })
        axios.get('/api/getRSS/' + key)
            .then(data => this.setState({ post: data }));
        this.setState({ start: false })
    }
    getHTML(key) {
        db.getHTMLBody(key).then(snapshot => {
            this.setState({ body: snapshot.val() })
            return this.state.body;
        })
        this.setState({ start: false })
    }
    incCount(){
        this.setState({ i: this.state.i + 1 })
    }
    timer() {
        this.setState({
            currentCount: this.state.currentCount - 1
        })
        if (this.state.currentCount <=1 ) {
            //clearInterval(this.intervalId);
           this.setState({currentCount: 60})
        }
        if (this.state.currentCount % 5 === 0)
        {
            this.start()
            this.incCount()
        }
    }
    componentDidMount() {
        this.intervalId = setInterval(this.timer.bind(this), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
    saveKey(KEYS) {
        this.setState({ contentKey: [...this.state.contentKey, KEYS] })
    }
    render() {
        return (
            <div>
                <div dangerouslySetInnerHTML={{ __html: this.state.body }}/> 
            </div>
        );
    }
}
export default Play;