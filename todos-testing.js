import http from 'k6/http';
import { check, group } from 'k6';

export let options = {
    vus: 1,
};

export default function () {
    group('API uptime check', () => {
        const response = http.get('https://todo-app-barkend.herokuapp.com/todos/');
        check(response, {
            "status code should be 200": res => res.status === 200,
        });
    });

    let todoID;
    group('Create a Todo', () => {
        const response = http.post('https://todo-app-barkend.herokuapp.com/todos/', 
        {"task": "write k6 tests"}
        );
        todoID = response.json()._id;
        check(response, {
            "status code should be 200": res => res.status === 200,
        });
        check(response, {
            "response should have created todo": res => res.json().completed === false,
        });
    })

     group('get a todo item', () => {
        const response = http.get(`https://todo-app-barkend.herokuapp.com/todos/${todoID}`
        );
        check(response, {
            "status code should be 200": res => res.status === 200,
        });
        check(response, {
            "response should have the created todo": res => res.json()[0]._id === todoID,
        });
        console.log(JSON.stringify(response.json()[0]));

        check(response, {
            "response should have the correct state": res => res.json()[0].completed === false,
        });
    })

    group('delete all Todos', () => {
        let response = http.del(`https://todo-app-barkend.herokuapp.com/todos/`
        );

        check(response, {
            "status code should be 200": res => res.status === 200,
        });
    })
}
