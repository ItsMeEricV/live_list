class API::V1::TimersController < ApplicationController

  # GET /timers
  def index

    
    render json: {status: "yes"}, status: :ok
    

  end

  # GET /timers/1
  # GET /timers/:id
  def show

    # @list = List.find(params[:id])
    # render json: @list.timer

    render json: {status: "yes"}, status: :ok

  end

  # POST /timers
  def create

    #@timer = Timer.new(name: params[:name],state: params[:state],current_timecode: params[:timecode])
    @list = List.find(params[:list_id])
    timer_params = {state: "stopped", start_time: Time.now.to_i, duration: 0}


    if @list.create_timer(timer_params)
      render json: @list, status: :created
    else
      render json: @list.errors, status: :unprocessable_entity
    end

  end

  # PUT /timers/1
  def update

    @list = List.find(params[:id])
    @list.timer_attributes = timer_params

    if @list.save
      render json: @list, status: :ok
    else
      render json: @list.errors, status: :unprocessable_entity
    end


  end


  private

  def timer_params
    params.permit(:state,:start_time,:duration)
  end

end
