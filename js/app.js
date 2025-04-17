class CalorieTracker {
    constructor(){
        this._calorieLimit = Storage.getCalorieLimit(2000);
        this._totalCalories = Storage.getTotalCalories(0);
        this._meals = Storage.getMeals();
        this._workouts = Storage.getWorkouts();

        this._meals.forEach(meal => this._displayNewMeal(meal));
        this._workouts.forEach(workout => this._displayNewWorkout(workout))

        this._displayCaloriesTotal()
        this._displayCaloriesLimit()
        this._displayCaloriesConsumed()
        this._displayCaloriesProgress()
        this._displayCaloriesRemaining()
        this._displayCaloriesBurned()

        document.getElementById('limit').value = this._calorieLimit
    }
    // public methods / API //
    addMeal(meal){
        this._meals.push(meal)
        this._totalCalories += meal.calories
        Storage.setTotalCalories(this._totalCalories)
        Storage.setMeals(this._meals)
        this._displayNewMeal(meal)
        this._render()
    }
    addWorkout(workout){
        this._workouts.push(workout)
        this._totalCalories -= workout.calories
        Storage.setTotalCalories(this._totalCalories)
        Storage.setWorkouts(this._workouts)
        this._displayNewWorkout(workout)
        this._render()
    }
    removeMeal(id){
        const meal = this._meals.find(meal => meal.id === id)
        meal && (this._totalCalories -= meal.calories);
        Storage.setTotalCalories(this._totalCalories)
        this._meals = this._meals.filter(meal => meal.id !== id); 
        Storage.setMeals(this._meals)
        this._render()
    }
    removeWorkout(id){
        const workout = this._workouts.find(workout => workout.id === id )
        workout && (this._totalCalories += workout.calories)
        Storage.setTotalCalories(this._totalCalories)
        this._workouts = this._workouts.filter(workout => workout.id !== id)
        Storage.setWorkouts(this._workouts)
        this._render()
    }
    reset(){
        if(confirm('Are you sure you want to reset all data?')){
            this._totalCalories = 0;
            this._meals = []
            this._workouts = []
            document.getElementById('meal-items').innerHTML = ''
            document.getElementById('workout-items').innerHTML = ''
            localStorage.clear();
            this._render()
        }  
    }
    setLimit(limit){
        this._calorieLimit = +limit
        Storage.setCalorieLimit(+limit)
        this._render()
    }
    // Private methods/ API //
    _displayCaloriesTotal(){
        const totalCaloriesEl = document.getElementById('calories-total')
        totalCaloriesEl.textContent = this._totalCalories
    }
    _displayCaloriesLimit(){
        const LimitCaloriesEl = document.getElementById('calories-limit')
        LimitCaloriesEl.textContent = this._calorieLimit
    }
    _displayCaloriesConsumed(){
        const CaloriesConsumedEl = document.getElementById('calories-consumed')
        let consumed  = this._meals.reduce((acc,el)=>el.calories + acc , 0)
        CaloriesConsumedEl.textContent = consumed 
    }
    _displayCaloriesBurned(){
        const CaloriesBurnedEl = document.getElementById('calories-burned')
        let burned = this._workouts.reduce((acc,el) => el.calories + acc , 0);
        CaloriesBurnedEl.textContent = burned || '0';
    }
    _displayCaloriesRemaining(){
        const CaloriesRemainingEl = document.getElementById('calories-remaining')
        const progress = document.getElementById('calorie-progress')

        let remaining = this._calorieLimit - this._totalCalories
        CaloriesRemainingEl.textContent = remaining
        if(remaining <= 0){
            CaloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light')
            CaloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger')
            progress.classList.remove('bg-success')
            progress.classList.add('bg-danger')
        } else{
            CaloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger')
            CaloriesRemainingEl.parentElement.parentElement.classList.add('bg-light')
            progress.classList.remove('bg-danger')
            progress.classList.add('bg-success')
        }  

    }
    _displayCaloriesProgress(){
        const progress = document.getElementById('calorie-progress')
        const percentage = (this._totalCalories * 100)  / this._calorieLimit
        const width = Math.min(percentage,100)
        progress.style.width = `${width}%`

    }
    _displayNewMeal(meal){
        const mealsEl = document.getElementById('meal-items')
        const mealEl = document.createElement('div')
        mealEl.classList.add('card','my-2')
        mealEl.setAttribute('data-id',meal.id)
        mealEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `
        mealsEl.appendChild(mealEl)
    }
    _displayNewWorkout(workout){
        const workoutsEl = document.getElementById('workout-items')
        const workoutEl = document.createElement('div')
        workoutEl.classList.add('card','my-2')
        workoutEl.setAttribute('data-id',workout.id)
        workoutEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
        `
        workoutsEl.appendChild(workoutEl)
    }
    _render(){
        this._displayCaloriesTotal();
         this._displayCaloriesLimit();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}
class Meal {
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2)
        this.name = name;
        this.calories = calories
    }
}
class Workout {
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2)
        this.name = name;
        this.calories = calories
    }
}
class Storage {
    static getCalorieLimit(defaultLimit = 2000){
        return localStorage.getItem('calorieLimit') !== null
        ? +localStorage.getItem('calorieLimit')
        : defaultLimit
    }
    static setCalorieLimit(calorieLimit){
        localStorage.setItem('calorieLimit',+calorieLimit)
    }
    static getTotalCalories(defautCalories = 0){
        return localStorage.getItem('totalCalories') !== null
        ? +localStorage.getItem('totalCalories')
        : defautCalories
    }
    static setTotalCalories(calorieLimit){
        localStorage.setItem('totalCalories',calorieLimit)
    }
    static getMeals(defaultMeals = []){
        return localStorage.getItem('meals') !== null
        ? JSON.parse(localStorage.getItem('meals'))
        : defaultMeals
    }
    static setMeals(meals){
        localStorage.setItem('meals',JSON.stringify(meals))
    }

    static getWorkouts(defaultWorkouts = []){
        return localStorage.getItem('workouts') !== null
        ? JSON.parse(localStorage.getItem('workouts'))
        : defaultWorkouts
    }
    static setWorkouts(workouts){
        localStorage.setItem('workouts',JSON.stringify(workouts))
    }
}
class App {
    constructor() {
        this._tracker = new CalorieTracker();
        document.getElementById('meal-form').addEventListener('submit',this._newItem.bind(this,'meal'))
        document.getElementById('workout-form').addEventListener('submit',this._newItem.bind(this,'workout'))
        document.getElementById('meal-items').addEventListener('click',this._removeItem.bind(this,'meal'))
        document.getElementById('workout-items').addEventListener('click',this._removeItem.bind(this,'workout'))
        document.getElementById('filter-meals').addEventListener('keyup',this._filterItems.bind(this,'meal'))
        document.getElementById('filter-workouts').addEventListener('keyup',this._filterItems.bind(this,'workout'))
        document.getElementById('reset').addEventListener('click',this._reset.bind(this))
        document.getElementById('limit-form').addEventListener('submit',this._setLimit.bind(this))
    }
    _newItem(type,e){
        e.preventDefault()
        const  name = document.getElementById(`${type}-name`).value
        const calories = document.getElementById(`${type}-calories`).value
        if(name === '' || calories === ''){
              alert('Please fill in the form !')
              return;
        }

        if(type === 'meal'){
            const newMeal = new Meal(name,+calories)
            this._tracker.addMeal(newMeal)
            document.getElementById('meal-form').reset()
        }else{
            const newWorkout = new Workout(name,+calories)
            this._tracker.addWorkout(newWorkout)
            document.getElementById('workout-form').reset()
        }

        const collapsItem = document.getElementById(`collapse-${type}`)
        const bsCollaps = new bootstrap.Collapse(collapsItem,{
            toggle: true,
        })
        
        
    }
    _removeItem(type, e) {
        const target = e.target;
    
        if (target.classList.contains('delete') || target.classList.contains('fa-xmark')) {
            if (confirm('Are you sure!')) {
                const card = target.closest('.card');
                const id = card.getAttribute('data-id');
                if (type === 'meal') {
                    this._tracker.removeMeal(id);
                } else {
                    this._tracker.removeWorkout(id);
                }
                card.remove();
            }
        }
    }
    _filterItems(type,e){
        const text = e.target.value.toLowerCase()
            document.querySelectorAll(`#${type}-items .card`).forEach(item =>
            {
                const name = item.firstElementChild.firstElementChild.textContent.toLowerCase()

                if(name.indexOf(text) !== -1){
                    item.style.display = 'block'
                }else{
                    item.style.display = 'none'
                }
            }
            )
    }
    _reset(){
        this._tracker.reset()
    }
    _setLimit(e){
        e.preventDefault()
        const limit = document.getElementById('limit').value
        if(limit === ''){
            alert('Please fill in the form')
            return;
        }

        this._tracker.setLimit(limit)

        const modalElement = document.getElementById('limit-modal');
        const modal = bootstrap.Modal.getInstance(modalElement); 
        modal.hide();
    }
    
}

const app = new App()

