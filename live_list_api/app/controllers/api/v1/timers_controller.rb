class API::V1::TimersController < ApplicationController

  # GET /timers
  # TODO GET a list of all timers
  def index

    render json: {status: "yes"}, status: :ok
    
  end

  # GET /timers/:list_id
  def show

    @list = List.find(params[:id])
    render json: @list.timer

  end

  # POST /timers/:list_id
  def create

    ## NO POST ACTION NEEDED since we create the Timer object at the same time we create the parent List object


    # @list = List.find(params[:list_id])
    # timer_params = {state: "stopped", action_time: Time.now.to_i, duration: 0}

    # if @list.create_timer(timer_params)
    #   render json: @list, status: :created
    # else
    #   render json: @list.errors, status: :unprocessable_entity
    # end

  end

  # PUT /timers/:id
  # NOTE that the :id is the LIST ID since currently only one timer per list is embedded in the List MongoDB Document
  def update

    @list = List.find(params[:id])
    timer_params = {}
    action_time = timer_edit_params[:action_time].to_i

    #if starting a timer
    if(timer_edit_params[:state] == "started")
      timer_params[:action_time] = action_time
      timer_params[:state] = "started"
    elsif(timer_edit_params[:state] == "stopped") #stopping a timer
      #set the duration parameter. This says how long the timer has been running since the last reset.
      #subtract the action_time from the current timer time to find the duration of the current action, then add it to the current stored duration to keep a running total
      timer_params[:duration] =  (action_time - @list.timer.action_time) + @list.timer.duration
      timer_params[:action_time] = action_time
      timer_params[:state] = "stopped"
    end

    #render json: {old_action_time: @list.timer.action_time, new_action_time: action_time} and return

    @list.timer_attributes = timer_params

    if @list.save
      render json: {duration: timer_params[:duration]}, status: :ok
      #render json: @list, status: :ok
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end


  private

  def timer_edit_params
    params.permit(:state,:action_time,:duration)
  end

end
